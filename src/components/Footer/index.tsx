import styles from "./index.module.scss";

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <p>
                The source for this site is released under the MIT license. Source:{" "}
                <a href="https://github.com/iokira/iokira.github.io">
                    iokira/iokira.github.io
                </a>
            </p>
            <p>&copy;iokira 2025</p>
        </footer>
    );
};
