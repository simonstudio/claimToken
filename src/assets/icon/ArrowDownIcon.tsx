import { Component, ReactNode, SVGProps } from 'react';

class ArrowDownIcon extends Component<SVGProps<ArrowDownIcon>> {
  render(): ReactNode {
    return (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"  aria-hidden="true">
        <g filter="url(#filter0_dd_1145_4505)" >
        <rect x="1" width="24" height="24" rx="12" fill="white" shapeRendering="crispEdges" ></rect>
        <path d="M12.4608 15.4395C12.7421 15.7441 13.2343 15.7441 13.5155 15.4395L18.0155 10.9395C18.3202 10.6582 18.3202 10.166 18.0155 9.88477C17.7343 9.58008 17.2421 9.58008 16.9608 9.88477L12.9999 13.8457L9.01553 9.88477C8.73428 9.58008 8.24209 9.58008 7.96084 9.88477C7.65615 10.166 7.65615 10.6582 7.96084 10.9395L12.4608 15.4395Z" fill="#182B48" ></path>
        </g>
        <defs >
        <filter id="filter0_dd_1145_4505" x="0" y="0" width="26" height="26" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB" >
        <feFlood floodOpacity="0" result="BackgroundImageFix" ></feFlood>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" ></feColorMatrix>
        <feOffset dy="1" ></feOffset>
        <feGaussianBlur stdDeviation="0.5" ></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="out" ></feComposite>
        <feColorMatrix type="matrix" values="0 0 0 0 0.152941 0 0 0 0 0.133333 0 0 0 0 0.141176 0 0 0 0.1 0" ></feColorMatrix>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1145_4505" ></feBlend>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" ></feColorMatrix>
        <feOffset dy="1" ></feOffset>
        <feGaussianBlur stdDeviation="0.5" ></feGaussianBlur>
        <feComposite in2="hardAlpha" operator="out" ></feComposite>
        <feColorMatrix type="matrix" values="0 0 0 0 0.0468639 0 0 0 0 0.366259 0 0 0 0 0.621014 0 0 0 0.1 0" ></feColorMatrix>
        <feBlend mode="normal" in2="effect1_dropShadow_1145_4505" result="effect2_dropShadow_1145_4505" ></feBlend>
        <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_1145_4505" result="shape" ></feBlend>
        </filter>
        </defs>
      </svg>
    );
  }
}

export default ArrowDownIcon;