// import React, { createContext, useContext } from 'react';
// import { GenericService } from '../Lib/GenericService';

// // Create the context and provide an initial default value (null)
// export const ApiServiceContext = createContext(null);  // Export the context

// // ApiServiceProvider component that provides the service to the app
// export const ApiServiceProvider = ({ children }) => {
//   const apiService = new GenericService("asdas");

//   return (
//     <ApiServiceContext.Provider value={apiService}>
//       {children}  {/* Provide the service to children components */}
//     </ApiServiceContext.Provider>
//   );
// }; 

// // Custom hook to access the service from context
// export const useApiService = () => {
//   const context = useContext(ApiServiceContext);
//   if (!context) {
//     throw new Error('useApiService must be used within an ApiServiceProvider');
//   }
//   return context;
// };
