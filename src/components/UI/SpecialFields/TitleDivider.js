/* React Imports */
import React from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

/**
 *@title: the title you wish to display above divider
 *@icon: start icon
 *@typography Variant
 *divider variant
 *style: global div styling
 * @param {*} props
 * @returns
 */
const TitleDivider = props => {
  const { title, icon, typographyVariant, dividerVariant, style } = props;
  return (
    <div style={style}>
      <div style={{ display: "flex" }}>
        {icon}
        <Typography
          variant={typographyVariant}
          style={Boolean(icon) ? { marginLeft: "8px" } : null}
        >
          {title}
        </Typography>
      </div>
      <Divider variant={dividerVariant} />
    </div>
  );
};

export default TitleDivider;
