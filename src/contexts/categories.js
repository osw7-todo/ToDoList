import React, {createContext, useState} from 'react';

const CategoryContext = createContext({
    category: {categories: [{id: null, text: null}]},
    dispatch: () => {},
});

const CategoryProvider = ({children}) => {
    const [categories, setCategories] = useState({});

    const value = {category:{categories}, dispatch: setCategories};
    return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>
};

const CategoryConsumer = CategoryContext.Consumer;

export {CategoryProvider, CategoryConsumer};
export default CategoryContext;