type BrandNameProps = {
  className?: string;
};

export function BrandName({ className }: BrandNameProps) {
  const classes = ["text-primary text-[40px] leading-[44px] font-normal", className]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>keep.it.iNyourEyEs</div>;
}