'use client';

import MigrationGuideModal from './MigrationGuideModal';

type DailyLimitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  featureLabel: string;
};

export default function DailyLimitModal({
  isOpen,
  onClose,
  featureLabel,
}: DailyLimitModalProps) {
  return (
    <MigrationGuideModal
      isOpen={isOpen}
      onClose={onClose}
      badge="하루 1회"
      title="오늘은 이미 이용하셨습니다"
      description={`${featureLabel}은 무료로 하루에 1회까지 이용할 수 있습니다. 추가로 생성하시려면 「모두의 안전」을 이용해 주세요.`}
    />
  );
}
