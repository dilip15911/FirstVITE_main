import React, { createContext, useContext, useReducer } from 'react';

const LoadingContext = createContext(null);

const loadingReducer = (state, action) => {
  switch (action.type) {
    case 'START_LOADING':
      return {
        ...state,
        [action.payload.key]: true,
        messages: {
          ...state.messages,
          [action.payload.key]: action.payload.message || 'Loading...'
        }
      };
    case 'STOP_LOADING':
      const newMessages = { ...state.messages };
      delete newMessages[action.payload.key];
      const newState = { ...state };
      delete newState[action.payload.key];
      return {
        ...newState,
        messages: newMessages
      };
    default:
      return state;
  }
};

export const LoadingProvider = ({ children }) => {
  const [loadingState, dispatch] = useReducer(loadingReducer, { messages: {} });

  const startLoading = (key, message) => {
    dispatch({ type: 'START_LOADING', payload: { key, message } });
  };

  const stopLoading = (key) => {
    dispatch({ type: 'STOP_LOADING', payload: { key } });
  };

  const isLoading = (key) => {
    return !!loadingState[key];
  };

  const getMessage = (key) => {
    return loadingState.messages[key];
  };

  const anyLoading = () => {
    return Object.keys(loadingState).some(key => key !== 'messages' && loadingState[key]);
  };

  return (
    <LoadingContext.Provider value={{ 
      startLoading, 
      stopLoading, 
      isLoading, 
      getMessage,
      anyLoading 
    }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export default LoadingContext;
