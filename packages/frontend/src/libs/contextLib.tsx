import { createContext, useContext, useEffect, useState } from "react";
import { Auth } from "aws-amplify";

export interface AppContextType {
  isAuthenticated: boolean;
  userHasAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo?: any;
}

export const AppContext = createContext<AppContextType>({
  isAuthenticated: false,
  userHasAuthenticated: useAppContext,
  userInfo: {},
});

// provider
export const AppProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  // user info
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
      const user = await Auth.currentUserInfo();
      setUserInfo(user);
    } catch (e) {
      console.log(e);
      if (e !== "No current user") {
        alert(e);
      }
    }

    setIsAuthenticating(false);
  }

  if (isAuthenticating) {
    return <div>Loading...</div>;
  }

  return (
    <AppContext.Provider
      value={
        { isAuthenticated, userHasAuthenticated, userInfo } as AppContextType
      }
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  return useContext(AppContext);
}
