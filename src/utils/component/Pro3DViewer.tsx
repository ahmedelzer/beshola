// Pro3DViewerModal.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Dimensions,
  Text,
  Modal,
  StyleSheet,
  PanResponder,
} from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const { width, height } = Dimensions.get("window");

// Test object URL (Duck GLB from Khronos sample)
const MODEL_URL =
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb";

export default function Pro3DViewerModal() {
  const [visible, setVisible] = useState(false);
  const [cameraMode, setCameraMode] = useState<"FPS" | "Orbit">("FPS");

  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const orbitTarget = useRef(new THREE.Vector3(0, 0, 0));
  const velocity = useRef({ forward: 0, right: 0 });
  const rotation = useRef({ yaw: 0, pitch: 0 });
  const loaded = useRef<THREE.Object3D>();

  // Move Joystick State
  const [moveJoystickPos, setMoveJoystickPos] = useState({ x: 0, y: 0 });
  const moveJoystickRef = useRef({ active: false, startX: 0, startY: 0 });

  // Look Joystick State
  const [lookJoystickPos, setLookJoystickPos] = useState({ x: 0, y: 0 });
  const lookJoystickRef = useRef({ active: false, startX: 0, startY: 0 });

  // MOVE JOYSTICK HANDLERS
  const handleMoveStart = (e: any) => {
    const touch = e.nativeEvent.touches[0];
    moveJoystickRef.current = {
      active: true,
      startX: touch.pageX,
      startY: touch.pageY,
    };
  };
  const handleMove = (e: any) => {
    if (!moveJoystickRef.current.active) return;
    const touch = e.nativeEvent.touches[0];
    const dx = touch.pageX - moveJoystickRef.current.startX;
    const dy = touch.pageY - moveJoystickRef.current.startY;

    velocity.current.forward = -dy * 0.02;
    velocity.current.right = dx * 0.02;

    setMoveJoystickPos({ x: dx, y: dy });
  };
  const handleMoveEnd = () => {
    moveJoystickRef.current.active = false;
    velocity.current = { forward: 0, right: 0 };
    setMoveJoystickPos({ x: 0, y: 0 });
  };

  // LOOK JOYSTICK HANDLERS
  const handleLookStart = (e: any) => {
    const touch = e.nativeEvent.touches[0];
    lookJoystickRef.current = {
      active: true,
      startX: touch.pageX,
      startY: touch.pageY,
    };
  };
  const handleLook = (e: any) => {
    if (!lookJoystickRef.current.active || !cameraRef.current) return;
    const touch = e.nativeEvent.touches[0];
    const dx = touch.pageX - lookJoystickRef.current.startX;
    const dy = touch.pageY - lookJoystickRef.current.startY;

    rotation.current.yaw -= dx * 0.003;
    rotation.current.pitch -= dy * 0.003;
    rotation.current.pitch = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, rotation.current.pitch),
    );

    setLookJoystickPos({ x: dx, y: dy });
  };
  const handleLookEnd = () => {
    lookJoystickRef.current.active = false;
    setLookJoystickPos({ x: 0, y: 0 });
  };

  // THREE/GL Setup
  const onContextCreate = async (gl: any) => {
    console.log("🚀 GL Context Created");
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 1.7, 6);
    cameraRef.current = camera;

    // Light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    scene.add(hemiLight);

    // Ground plane
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({
        color: 0x555555,
        side: THREE.DoubleSide,
      }),
    );
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    // Load GLB model
    const loader = new GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        loaded.current = gltf.scene;
        gltf.scene.position.set(0, 0, 0);
        scene.add(gltf.scene);
        console.log("✅ Model loaded");
      },
      (xhr) => {
        console.log(
          `⏳ Loading: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}%`,
        );
      },
      (error) => {
        console.error("❌ Error loading model:", error);
      },
    );

    const clock = new THREE.Clock();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (!cameraRef.current) return;
      const delta = clock.getDelta();

      // FPS Camera Mode
      if (cameraMode === "FPS") {
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
          camera.quaternion,
        );
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(
          camera.quaternion,
        );
        camera.position.add(forward.multiplyScalar(velocity.current.forward));
        camera.position.add(right.multiplyScalar(velocity.current.right));

        camera.rotation.order = "YXZ";
        camera.rotation.y = rotation.current.yaw;
        camera.rotation.x = rotation.current.pitch;
      }

      // Orbit Camera Mode
      if (cameraMode === "Orbit" && loaded.current) {
        const radius = 6;
        camera.position.x =
          orbitTarget.current.x +
          radius *
            Math.sin(rotation.current.yaw) *
            Math.cos(rotation.current.pitch);
        camera.position.y =
          orbitTarget.current.y + radius * Math.sin(rotation.current.pitch);
        camera.position.z =
          orbitTarget.current.z +
          radius *
            Math.cos(rotation.current.yaw) *
            Math.cos(rotation.current.pitch);
        camera.lookAt(orbitTarget.current);
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    animate();
  };

  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{ margin: 20, fontWeight: "bold" }}
        onPress={() => setVisible(true)}
      >
        Open 3D Viewer
      </Text>

      <Modal visible={visible} animationType="slide" transparent={false}>
        <View style={{ flex: 1 }}>
          <GLView
            style={{ flex: 1, backgroundColor: "#222" }}
            onContextCreate={onContextCreate}
          />

          {/* Move Joystick */}
          <View
            style={styles.joystickBaseLeft}
            onStartShouldSetResponder={() => true}
            onResponderGrant={handleMoveStart}
            onResponderMove={handleMove}
            onResponderRelease={handleMoveEnd}
          >
            <View
              style={[
                styles.joystickThumb,
                {
                  transform: [
                    { translateX: moveJoystickPos.x / 2 },
                    { translateY: moveJoystickPos.y / 2 },
                  ],
                },
              ]}
            />
          </View>

          {/* Look Joystick */}
          <View
            style={styles.joystickBaseRight}
            onStartShouldSetResponder={() => true}
            onResponderGrant={handleLookStart}
            onResponderMove={handleLook}
            onResponderRelease={handleLookEnd}
          >
            <View
              style={[
                styles.joystickThumb,
                {
                  transform: [
                    { translateX: lookJoystickPos.x / 2 },
                    { translateY: lookJoystickPos.y / 2 },
                  ],
                },
              ]}
            />
          </View>

          {/* Buttons */}
          <View style={{ position: "absolute", top: 40, left: 20 }}>
            <Text
              style={styles.buttonText}
              onPress={() =>
                setCameraMode(cameraMode === "FPS" ? "Orbit" : "FPS")
              }
            >
              Switch Camera ({cameraMode})
            </Text>
          </View>

          <View style={{ position: "absolute", top: 40, right: 20 }}>
            <Text
              style={styles.closeButtonText}
              onPress={() => setVisible(false)}
            >
              Close
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  joystickBaseLeft: {
    position: "absolute",
    bottom: 50,
    left: 50,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  joystickBaseRight: {
    position: "absolute",
    bottom: 50,
    right: 50,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  joystickThumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    padding: 10,
    backgroundColor: "#4a90e2",
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    padding: 10,
    backgroundColor: "#f00",
    borderRadius: 8,
  },
});
