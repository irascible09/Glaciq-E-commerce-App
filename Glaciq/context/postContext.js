import React, { createContext, useState, useEffect } from "react";

import api from '../src/utils/api'

//creating context
const PostContext = createContext({
    posts: [],
    loading: false,
    getpost: () => { },
}
)


//provider component
const PostProvider = ({ children }) => {

    //states
    const [loading, setloading] = useState(false);
    const [posts, setposts] = useState([])  // array becaus there will be multiple posts

    //creating function to get posts from network
    const getpost = async () => {

        setloading(true)

        try {
            const { data } = await api.get('/posts/get-post')
            setloading(false)
            setposts(data?.posts)

        } catch (error) {
            console.log(error)
            setloading(false)
        }

    };




    return (

        <PostContext.Provider
            value={{ posts, setposts, getpost }}>
            {children}
        </PostContext.Provider>
    )

}

export { PostContext, PostProvider }