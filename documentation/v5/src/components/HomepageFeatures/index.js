import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Prefix, suffix and thousand separator.',
    description: <></>,
  },
  {
    title: 'Custom format pattern.',
    description: <></>,
  },

  {
    title: 'Masking.',
    description: <></>,
  },

  {
    title: 'Custom formatting handler.',
    description: <></>,
  },
  {
    title: 'Format number in an input or format as a simple text.',
    description: <></>,
  },
  {
    title: 'Fully customizable.',
    description: <></>,
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div>
      <div className="text--left">{/* <Svg className={styles.featureSvg} role="img" /> */}</div>
      <div className="text--left padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <h1>Features</h1>
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}
