/* React Imports */
import React from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

/**
 *@title the title you wish to display above divider
 *@icon start icon
 *@typography Variant
 *@divider variant
 *@style: global div styling
 *@end component
 *@start component
 * @param {*} props
 * @returns
 */
const TitleDivider = props => {
  const {
    title,
    icon,
    typographyVariant,
    dividerVariant,
    style,
    endComponent,
    startComponent
  } = props;
  return (
    <div style={style}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {icon}
        {startComponent}
        <Typography
          variant={typographyVariant}
          style={Boolean(icon) ? { marginLeft: "8px", alignSelf: "center" } : { marginLeft: "16px", alignSelf: "center" }}
        >
          {title}
        </Typography>
        {endComponent}
      </div>
      <Divider variant={dividerVariant} />
    </div>
  );
};

export default TitleDivider;
