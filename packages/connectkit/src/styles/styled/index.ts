/**
 *
 * IMPORTANT NOTE: This file is a workaround for the following issue:
 *
 * When using rollup with styled-components to build into an ES module, styled components decides to move all of it’s DOM elements into "styled.default" rather than just within "styled"
 *
 * We're unsure as to why this issue occurs, if you have any ideas or a better solution please let us know by opening a discussion on our GitHub repo:
 * https://github.com/family/connectkit/discussions/new
 *
 */

import styled from 'styled-components';
export default typeof styled.div === 'function' ? styled : styled['default'];
