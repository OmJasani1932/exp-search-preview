import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { ProductRecord } from '../../types/searchResponse';
import { RawJsonModal } from '../RawJsonModal/RawJsonModal';
import styles from './ProductCard.module.css';

interface Props {
  record: ProductRecord;
}

const COLOR_MAP: Record<string, string> = {
  Red: '#e05252',
  Blue: '#5278e0',
  Green: '#52b452',
  Black: '#555',
  White: '#ccc',
  Yellow: '#e0c952',
  Pink: '#e080b4',
  Purple: '#9452e0',
  Orange: '#e08852',
};

export const ProductCard: React.FC<Props> = ({ record }) => {
  const [showRanking, setShowRanking] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const variant = record.selected_variant;
  const ranking = record.ranking_info;
  const imageUrl = record.primary_image_url ?? variant?.primary_image_url;
  const price = record.price ?? variant?.price;
  const color = variant?.color;
  const colorDot = color ? COLOR_MAP[color] ?? '#8b949e' : null;

  return (
    <div className={styles.card}>
      {/* Position badge */}
      {ranking && (
        <div className={styles.positionBadge}>
          #{ranking.position}
          {ranking.is_pin && <span className={styles.pinTag}>📌</span>}
          {ranking.is_slotted && <span className={styles.slotTag}>🎰</span>}
        </div>
      )}

      {/* Image */}
      <div className={styles.imageWrap}>
        {imageUrl ? (
          <img src={imageUrl} alt={record.primary_image_alt_text ?? record.name} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>🖼️</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        {record.brand && <div className={styles.brand}>{record.brand}</div>}
        <div className={styles.name}>{record.name}</div>

        {price != null && (
          <div className={styles.price}>${Number(price).toFixed(2)}</div>
        )}

        {/* Variant info */}
        {variant && (
          <div className={styles.variantRow}>
            {colorDot && (
              <span className={styles.colorDot} style={{ background: colorDot }} title={color} />
            )}
            <span className={styles.variantName}>{variant.name}</span>
          </div>
        )}

        {/* IDs */}
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <span className={styles.metaLabel}>ID</span>
            <span className={styles.metaValue}>{record.provider_id}</span>
          </span>
          {variant && (
            <span className={styles.metaItem}>
              <span className={styles.metaLabel}>Variant</span>
              <span className={styles.metaValue}>{variant.provider_id}</span>
            </span>
          )}
        </div>

        {/* Ranking toggle */}
        {ranking && (
          <div className={styles.rankingSection}>
            <button
              className={styles.rankingToggle}
              onClick={() => setShowRanking((v) => !v)}
            >
              {showRanking ? '▲' : '▼'} Ranking Info
            </button>
            {showRanking && (
              <div className={styles.rankingGrid}>
                <RankingRow label="Overall" value={ranking.overall_score} highlight />
                <RankingRow label="Merchandising" value={ranking.merchandising_score} />
                <RankingRow label="Relevance" value={ranking.relevance_score} />
                <RankingRow label="Personalization" value={ranking.personalization_score} />
                <RankingRow label="Performance" value={ranking.performance_score} />
              </div>
            )}
          </div>
        )}
        {/* Show Product JSON */}
        <button
          className={styles.jsonBtn}
          onClick={() => setShowJson(true)}
        >
          {'{ }'} Show Product JSON
        </button>
      </div>

      {createPortal(
        <RawJsonModal open={showJson} onClose={() => setShowJson(false)} data={record} />,
        document.body
      )}
    </div>
  );
};

const RankingRow: React.FC<{ label: string; value: number | null; highlight?: boolean }> = ({
  label,
  value,
  highlight,
}) => (
  <div className={`${styles.rankingRow} ${highlight ? styles.rankingHighlight : ''}`}>
    <span className={styles.rankingLabel}>{label}</span>
    <span className={styles.rankingValue}>
      {value == null ? <span className={styles.null}>null</span> : value.toFixed(5)}
    </span>
  </div>
);
