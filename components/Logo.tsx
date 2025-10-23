import React from 'react';

// Base64 encoded logos to avoid external image requests and ensure they are always available.
// NOTE: Variable names can be confusing. 'logoLight' is the version for DARK backgrounds (light text).
const logoLight = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAACvCAMAAADob24jAAAAwFBMVEX////rABn+8/L1t7vudXv84+T+9/f2vL/sAADoAAD3xsj97u/yqKvtEhvsAAD++vr4ycv+9/j73N761tjvZWj3wr/tAADMtr7OWmLASUrVs7bDS03Jb3TPdnbIc3bDX2PAU1bGdHfGb3LCV1vAWFv+8/H5z9H4ysv1uLzydHfvb3GxQkStOTyvP0WqNzyuQUWsOkC4U1e0SlC8WV7AXmHGc3fJgYW/aW3Gbm7CZnC7X2HAX2LPj5LWhofRi4u8Y2e4VWAAAAN4SURBVHja7dyNVtJAFIDhM6A0ICKi4lqxoKgoKCrudb3//5d2EjaTxflBDvA+z55rnUSyM5k50YgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgsri8vL28vLy9vLy8vby8vLy9vLy8vby8vLy9vLy8vby8vLy9vLy8vby8vLy9vLy8vby8vLy9vLy8vby8vLy9vLy8vby8vLy9vLy8vby8vLy9vLw+jE+vP8znl583x+OX12+Pf+PjD8+/Pvz04/s3/v3+x98+/Pv5j7/d//i/9f9c/e8O+j6t7h8H8A8Xj9r7x0H8rXg/1+6vBfA73t+q97cC+An/59V+vAXwn/f/Vvv7AfyZ/0/W/l4A/8b/l7X9/QD+xf8vavu/A/gz/z+s7V8H8F/4/2FtvzqA3/L/Y22/PYB/7f+ntf31Afy3/t/W9scD+Cf/P6ztzw/gf/7/YW1/fgB/5f9naf9gAL/m/5O0/8MA/ov/T9L+zwP4N/8/SPv/DOD3/H+Q9gA+4P8DaR8C8A3/H0j7CwH8gf8PpP1VAP/i/wek/XUA/8L/B0n7+wH8gf8PSfvrAfyH/w9J+/sB/Kn/D0n78wH8i/8PSfvzA/gD/x+k/YMB/Ir/D9L+wQD+jf8PSfs/D+Cf/H+Q9g9gAP/i/wep/QB+wf8Hqf0B/Ir/D1L7A/gN/x+k9gfwK/4/SO0P4Nf8f5DaH8Cv+P8gtT+A7/j/ILU/gN/w/0FqfwBf8P9Bag8C8JX/D1L7D4Cf8v9Baj8C8IT/D1L7I4C3/H+Q2p8A/sb/B6n9CeB9/h+k9ifwsP8PUnsB3vL/QWoP4AP+P0jtAfCH/w9Se+AP/B+k9gA+5f+D1B74n/8PUnsAv+X/g9Qe+A/g/0FqD+Af/j9I7YF/Av8fpHYA/uL/g9Qe+Afw/0FqD+BL/j9I7YF/Af8fpHYA/uL/g9Qe+Afw/0FqD2wA/x+kdsBvAP8fpHbA3wD+P0htAN8A/j9IbcBvAP8fpDbAbwD/H6Q24DcAf3gLgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgEv9Ayf9S42F5yJjAAAAAElFTSuQmCC';
// NOTE: 'logoDark' is the version for LIGHT backgrounds (dark text).
const logoDark = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAACvCAMAAADob24jAAAAwFBMVEX////3zM7+9/j0srX509T97+/2w8b62dr85OXsAADMtr7OWmLASUrVs7bDS03Jb3TPdnbIc3bDX2PAU1bGdHfGb3LCV1vAWFv+8/L2vL/1t7vudXvyqKvtEhvsAADrABnoAAD4ycv73N761tjvZWj3wr/tAACEf4fSj5LWhofRi4uzQE+vP0WqNzyuQUWsOkC3UVS0SlC8WV7AXmHGc3fJgYW/aW3Gbm7CZnC7X2HAX2KxQkStOTy4U1e8Y2e4VWAAAAN4SURBVHja7dyNVtJAFIDhM6A0ICKi4lqxoKgoKCrudb3//5d2EjaTxflBDvA+z55rnUSyM5k50YgDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgsri8vL28vLy9vLy8vby8vLy9vLy8vby8vLy9vLy8vby8vLy9vLy8vby8vLy9vLy8vby8vLy9vLy8vby8vLy9vLy8vby8vLy9vLy8vby8vLy9vLw+jE+vP8znl583x+OX12+Pf+PjD8+/Pvz04/s3/v3+x98+/Pv5j7/d//i/9f9c/e8O+j6t7h8H8A8Xj9r7x0H8rXg/1+6vBfA73t+q97cC+An/59V+vAXwn/f/Vvv7AfyZ/0/W/l4A/8b/l7X9/QD+xf8vavu/A/gz/z+s7V8H8F/4/2FtvzqA3/L/Y22/PYB/7f+ntf31Afy3/t/W9scD+Cf/P6ztzw/gf/7/YW1/fgB/5f9naf9gAL/m/5O0/8MA/ov/T9L+zwP4N/8/SPv/DOD3/H+Q9gA+4P8DaR8C8A3/H0j7CwH8gf8PpP1VAP/i/wek/XUA/8L/B0n7+wH8gf8PSfvrAfyH/w9J+/sB/Kn/D0n78wH8i/8PSfvzA/gD/x+k/YMB/Ir/D9L+wQD+jf8PSfs/D+Cf/H+Q9g9gAP/i/wep/QB+wf8Hqf0B/Ir/D1L7A/gN/x+k9gfwK/4/SO0P4Nf8f5DaH8Cv+P8gtT+A7/j/ILU/gN/w/0FqfwBf8P9Bag8C8JX/D1L7D4Cf8v9Baj8C8IT/D1L7I4C3/H+Q2p8A/sb/B6n9CeB9/h+k9ifwsP8PUnsB3vL/QWoP4AP+P0jtAfCH/w9Se+AP/B+k9gA+5f+D1B74n/8PUnsAv+X/g9Qe+A/g/0FqD+Af/j9I7YF/Av8fpHYA/uL/g9Qe+Afw/0FqD+BL/j9I7YF/Af8fpHYA/uL/g9Qe+Afw/0FqD2wA/x+kdsBvAP8fpHbA3wD+P0htAN8A/j9IbcBvAP8fpDbAbwD/H6Q24DcAf3gLgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgEv9Ayf9S42F5yJjAAAAAElFTSuQmCC';

interface LogoProps {
  isDarkMode?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ isDarkMode = false, className }) => {
  const logoSrc = isDarkMode ? logoLight : logoDark;
  return <img src={logoSrc} alt="Domus Logo" className={className} />;
};

export default Logo;
