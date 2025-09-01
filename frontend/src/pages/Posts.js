import React from "react";
import { Post } from "../components/Post";
import { Link } from "react-router";
// import { Link } from "react-router-dom";

const postsArr = []; //Don't know what actually goes inside this arr

const Posts = () => {
    return(
        <div>
            {postsArr.map(({ title, author, description }, index) => {
                return(
                    <div key = {index}>
                        <Post title = { title } author = { author } description = {description} />
                    </div>
                );
            })}
        </div>
    );
}

export default Posts;