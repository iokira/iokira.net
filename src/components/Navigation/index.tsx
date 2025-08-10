import styles from "./index.module.scss";

export const Navigation = () => {
    return (
<nav className={styles["nav-links"]}>
    <a href="/">iokira.net</a>
    <div className={styles["links"]}>
        <a href="/about">about</a>
        <a href="/blog">blog</a>
    </div>
</nav>
    )
}