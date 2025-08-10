import styles from "./index.module.scss";
import type { MarkdownInstance } from "astro";

type Props = {
    post: MarkdownInstance<Record<string, any>>;
};

export const BlogPostItem = ({ post }: Props) => {
    return (
        <div className={styles.blogPostItem}>
            <h3>
                <a href={post.url}>{post.frontmatter.title}</a>
            </h3>
            <p>投稿日: {post.frontmatter.publishDate}</p>
            <p>{post.frontmatter.description}</p>
        </div>
    );
};
