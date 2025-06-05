// src/app/utils/color-utils.ts

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



export function getProfileImage(imageArray: any[]): string {
  const placeholderImage: string = 'assets/images/general/no-image-found.jpg';

  // Check if the input is a valid array
  if (imageArray.length === 0) {
    return placeholderImage;
  }

  // Find the profile image with isProfileImage = true
  const profileImage = imageArray.find(
    (img: any) => img && img.isProfileImage && typeof img.imageUrl === 'string'
  );

  // Return the profile image URL if found, otherwise return the placeholder
  return profileImage?.imageUrl ?? placeholderImage;
}

// District-specific color mapping
const districtColors: { [key: string]: { bg: string, text: string, hover: string } } = {
  'East Sikkim': { bg: 'bg-blue-500/10', text: 'text-blue-500', hover: 'hover:bg-blue-500' },
  'West Sikkim': { bg: 'bg-green-500/10', text: 'text-green-500', hover: 'hover:bg-green-500' },
  'North Sikkim': { bg: 'bg-purple-500/10', text: 'text-purple-500', hover: 'hover:bg-purple-500' },
  'South Sikkim': { bg: 'bg-red-500/10', text: 'text-red-500', hover: 'hover:bg-red-500' }
};

export function getDistrictClass(region: string): string {
  const color = districtColors[region] || districtColors['East Sikkim']; // Default to East Sikkim if region not found
  return `${color.bg} ${color.text} ${color.hover}`;
}

