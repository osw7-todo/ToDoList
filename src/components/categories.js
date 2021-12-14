import React from 'react';
import {CategoryConsumer} from '../contexts/categories';

const Categories = () => {
    return(
        <CategoryConsumer>
            {({category})=>{category.categories}}
        </CategoryConsumer>
    )
};

export default Categories;