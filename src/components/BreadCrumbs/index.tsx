import styles from "./index.module.scss";
import type { Crumb } from "src/types/Crumb";

type Props = {
    crumbs: Crumb[];
    topic: string;
};

export const BreadCrumbs = ({ crumbs, topic }: Props) => {
    return (
        <nav className={styles.crumbs}>
            <ol>
                {crumbs.map((crumb) => (
                    <li key={crumb.url} className={styles.crumb}>
                        <a href={crumb.url}>{crumb.title}</a>
                    </li>
                ))}
                <li className={styles.crumb}>{topic}</li>
            </ol>
        </nav>
    );
};
