type BrandNameProps = {
  className?: string;
};

export function BrandName({ className }: BrandNameProps) {
  const classes = ["text-primary text-[24px] md:text-[28px]  xl:text-[40px] leading-[28px] md:leading-[32px] xl:leading-[44px] font-normal", className]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>keep.it.iNyourEyEs</div>;
}