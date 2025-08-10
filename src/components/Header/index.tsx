import styles from "./index.module.scss";
import { Navigation } from "@components/Navigation";

export const Header = () => {
    return (
        <header className={styles.header}>
            <Navigation />
        </header>
    );
};
