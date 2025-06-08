import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

// Define interfaces for your state objects
interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  gp: string;
  isAdmin: boolean;
}

interface GlobalContextType {
  userLogged: boolean;
  setUserLogged: Dispatch<SetStateAction<boolean>>;
  USER: User;
  setUSER: Dispatch<SetStateAction<User>>;
  stateArray: any[];
  setStateArray: Dispatch<SetStateAction<any[]>>;
  stateObject: any;
  setStateObject: Dispatch<SetStateAction<any>>;
  userState: any[];
  setUserState: Dispatch<SetStateAction<any[]>>;
  slideState: any[];
  setSlideState: Dispatch<SetStateAction<any[]>>;
  userRequestState: any[];
  setUserRequestState: Dispatch<SetStateAction<any[]>>;
  userReqUpdTime: number;
  setUserReqUpdTime: Dispatch<SetStateAction<number>>;
  unreadRequests: number;
  setUnreadRequests: Dispatch<SetStateAction<number>>;
  openMenu: boolean;
  setOpenMenu: Dispatch<SetStateAction<boolean>>;
  activeTab: any;
  setActiveTab: Dispatch<SetStateAction<any>>;
  adminTab: any;
  setAdminTab: Dispatch<SetStateAction<any>>;
}

// Create context with initial values typed
const GlobalContext = createContext<GlobalContextType>({
  userLogged: false,
  setUserLogged: () => {},
  USER: {
    id: '',
    name: '',
    phone: '',
    email: '',
    gp: '',
    isAdmin: false,
  },
  setUSER: () => {},
  stateArray: [],
  setStateArray: () => [],
  stateObject: {},
  setStateObject: () => {},
  userState: [],
  setUserState: () => [],
  slideState: [],
  setSlideState: () => [],
  userRequestState: [],
  setUserRequestState: () => [],
  userReqUpdTime: 0,
  setUserReqUpdTime: () => {},
  unreadRequests: 0,
  setUnreadRequests: () => {},
  openMenu: false,
  setOpenMenu: () => {},
  activeTab: 0,
  setActiveTab: () => {},
  adminTab: 0,
  setAdminTab: () => {},
});

interface GlobalContextProviderProps {
  children: ReactNode;
}

export const GlobalContextProvider: React.FC<GlobalContextProviderProps> = ({
  children,
}) => {
  const [USER, setUSER] = useState<User>({
    id: '',
    name: '',
    phone: '',
    email: '',
    gp: '',
    isAdmin: false,
  });

  const [userLogged, setUserLogged] = useState(false);
  const [stateArray, setStateArray] = useState<any[]>([]);
  const [stateObject, setStateObject] = useState<any>({});
  const [userState, setUserState] = useState<any[]>([]);
  const [slideState, setSlideState] = useState<any[]>([]);
  const [userRequestState, setUserRequestState] = useState<any[]>([]);
  const [userReqUpdTime, setUserReqUpdTime] = useState(Date.now() - 1000);
  const [unreadRequests, setUnreadRequests] = useState(0);
  const [openMenu, setOpenMenu] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [adminTab, setAdminTab] = useState(0);

  return (
    <GlobalContext.Provider
      value={{
        userLogged,
        setUserLogged,
        USER,
        setUSER,
        stateArray,
        setStateArray,
        stateObject,
        setStateObject,
        userState,
        setUserState,
        slideState,
        setSlideState,
        userRequestState,
        setUserRequestState,
        userReqUpdTime,
        setUserReqUpdTime,
        unreadRequests,
        setUnreadRequests,
        openMenu,
        setOpenMenu,
        activeTab,
        setActiveTab,
        adminTab,
        setAdminTab,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
