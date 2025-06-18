export enum GlobalEnums {
    village='Villages',
    homestays='Homestays',
    activities='Activities',
    product='Products',
    events='Events'
}

export enum paginatedEndpoints{
    villages = 'committees/paginated-committees',
    products = 'products/paginated-products',
    homestays = 'homestays/paginated-homestays',
    activities = 'Activities/paginated-activities',
    events = 'events/paginated-events',
    related= 'website/related-entities',
    nearby='website/nearby-entities'
}

export enum getByIDEndpoints{
    villages = 'committees',
    products = 'website/product',
    homestays = 'homestays',
    activities = 'Activities',
    events = 'events'
}

export enum placeholder{
    image='assets/images/general/no-image-found.jpg'
}

export enum search{
    itemPerPage =10
}