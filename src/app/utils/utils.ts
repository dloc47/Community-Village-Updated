// src/app/utils/color-utils.ts

import { stringify } from "querystring";

declare var $: any; // Declare jQuery

const colorClasses = [
    { bg: 'bg-blue-500/10', text: 'text-blue-500', hover: 'hover:bg-blue-500' },
    { bg: 'bg-red-500/10', text: 'text-red-500', hover: 'hover:bg-red-500' },
    { bg: 'bg-green-500/10', text: 'text-green-500', hover: 'hover:bg-green-500' },
    { bg: 'bg-purple-500/10', text: 'text-purple-500', hover: 'hover:bg-purple-500' }
  ];

  
  export function getDynamicClass(input: number): string {
    // Calculate the index based on the input value
    const index = (input - 1) % colorClasses.length;
    const { bg, text, hover } = colorClasses[index]; // Destructure the selected color class
  
    return `${bg} ${text} ${hover}`; // Return the combined class string
  }

 

  export function handleImageError(event: Event, fallback: string = ''): void {
    fallback = 'assets/images/general/no-image-found.jpg';

    const imgEl = event.target as HTMLImageElement;
  
    if (!imgEl || imgEl.src === fallback) {
      // Already tried fallback or target is not valid 
      imgEl.classList.add('image-failed');
      return;
    }
  
    imgEl.src = fallback;
  }
  

export function getProfileImage(imageArray: any[]): string {
  // Check if the input is a valid array
  if (imageArray.length === 0) {
    return ''
  }

  // Find the profile image with isProfileImage = true
  const profileImage = imageArray.find(
    (img: any) => img && img.isProfileImage && typeof img.imageUrl === 'string'
  );

  // Return the profile image URL if found, otherwise return the placeholder
  return profileImage?.imageUrl ?? '';
}

// District-specific color mapping
const districtColors: { [key: string]: { bg: string, text: string, border: string,hover: string } } = {
  'East Sikkim':  { bg: 'bg-blue-500/10',  text: 'text-blue-500',  border: 'border-blue-500/20' ,hover: '!text-blue-500'},
  'West Sikkim':  { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20' ,hover: '!text-green-500'},
  'North Sikkim': { bg: 'bg-purple-500/10',text: 'text-purple-500',border: 'border-purple-500/20' ,hover: '!text-purple-500'},
  'South Sikkim': { bg: 'bg-red-500/10',   text: 'text-red-500',   border: 'border-red-500/20' ,hover: '!text-red-500'}
};

// Fallback for unknown districts
const fallbackColor = { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300/20' ,hover: '!text-gray-600'};

// Returns class names as object for better control
export function getDistrictClass(region: string): string {
  const normalizedInput = region?.trim().toLowerCase() || '';
  const matchedKey = Object.keys(districtColors).find(
    key => key.toLowerCase() === normalizedInput
  );
  const color = matchedKey ? districtColors[matchedKey] : fallbackColor;
      return `${color.bg} ${color.text} ${color.border} ${color.hover}`;  
}

export function getClass(region:string):string{
   return getDistrictClass(region)
}


