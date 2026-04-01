import { useAuth } from "../../../context/auth";
import { SetHeaders } from "../../../request";

export default async function LoadData(
  state,
  dataSourceAPI,
  getAction,
  cache,
  updateRows,
  dispatch,
  abortController = false,
  reRequest = false,
) {
  const { requestedSkip, take, lastQuery, loading } = state;
  // const { signOut } = useAuth();
  // const navigate = useNavigate(); seen error dom hooks
  const query = dataSourceAPI(getAction, requestedSkip, take);
  if (!getAction || !query) return;
  if (query !== lastQuery && (!loading || abortController)) {
    const cached = cache.getRows(requestedSkip, take);
    if (cached.length === take) {
      updateRows(requestedSkip, take);
    } else {
      dispatch({ type: "FETCH_INIT" });
      const headers = await SetHeaders();
      fetch(query, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        // ...(abortController && { signal: abortController.current.signal }),
        signal: abortController?.current?.signal,
      })
        .then((response) => {
          // console.log(response, "response");
          return response.json();
        })
        .then(({ count, dataSource }) => {
          // if (dataSource.code === 401) {
          //   signOut();
          //   //todo handle error message
          //   // RedirectToLogin(navigate, dataSource);
          //   // return;
          // }
          cache.setRows(requestedSkip, dataSource);

          updateRows(requestedSkip, take, count);
          dispatch({ type: "UPDATE_QUERY", payload: query });
        })
        .catch((error) => {
          dispatch({ type: "REQUEST_ERROR" });
        });
    }
  }
}
