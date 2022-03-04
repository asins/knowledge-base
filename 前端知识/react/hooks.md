+++
title = "hooks"
template = "page.html"
date = "2022-03-04"
updated = "2022-03-04"
+++

数据请求的hook封闭，来源：https://www.robinwieruch.de/react-hooks-fetch-data
```javascript
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const useDataApi = (initialUrl, initialData) => {
  const [url, setUrl] = useState(initialUrl);
 
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });
 
  useEffect(() => {
    let didCancel = false;
 
    const fetchData = async () => {
      dispatch({ type: 'FETCH_INIT' });
 
      try {
        const result = await axios(url);
 
        if (!didCancel) {
          dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: 'FETCH_FAILURE' });
        }
      }
    };
 
    fetchData();
 
    return () => {
      didCancel = true;
    };
  }, [url]);
 
  return [state, setUrl];
};
```