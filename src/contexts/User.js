import React, {createContext, useState} from 'react';

const UserContext = createContext({
    user: {categories: {id: null, text: null}},
    dispatch: () => {},
});

const UserProvider = ({children}) => {
    const [categories, setCategories] = useState({});

    const value = {user: {categories}, dispatch: setCategories};
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

const UserConsumer = UserContext.Consumer;

export {UserProvider, UserConsumer};
export default UserContext;