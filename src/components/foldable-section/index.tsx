import React, { useState } from 'react';
import styles from './index.module.css';

interface FoldableSectionProps {
    title: string;
    children?: React.ReactNode;
    defaultOpen?: boolean;
}

export const FoldableSection: React.FC<FoldableSectionProps> = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles.container}>
            <div className={styles.title} onClick={handleToggle}>
                {title}
                <span className={styles.arrow}>{isOpen ? '▼' : '▶'}</span>
            </div>
            {isOpen && <div className={styles.children}>
                {children}
            </div>}
        </div>
    );
};
