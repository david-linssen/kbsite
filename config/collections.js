/** Returns all blog posts as a collection. */
const getAllPosts = collection => {
    const posts = collection.getFilteredByGlob("./src/blog/**/*.md");
    return posts.reverse();
};

module.exports = {
    getAllPosts
};
