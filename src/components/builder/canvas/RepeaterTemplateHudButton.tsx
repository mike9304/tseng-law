export interface RepeaterTemplateHudButtonProps {
  readonly ariaLabel: string;
  readonly dataAttribute: string;
  readonly disabled: boolean;
  readonly label: string;
  readonly onPress: () => void;
}

export function RepeaterTemplateHudButton({
  ariaLabel,
  dataAttribute,
  disabled,
  label,
  onPress,
}: RepeaterTemplateHudButtonProps) {
  const dataAttributes = {
    [`data-builder-repeater-template-${dataAttribute}`]: 'true',
  };
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        onPress();
      }}
      {...dataAttributes}
    >
      {label}
    </button>
  );
}
