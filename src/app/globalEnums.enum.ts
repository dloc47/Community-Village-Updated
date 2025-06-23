export enum GlobalEnums {
    village='Villages',
    homestays='Homestays',
    activities='Activities',
    product='Products',
    events='Events'
}

export enum paginatedEndpoints{
    villages = 'website/paginated-committees',
    products = 'website/paginated-products',
    homestays = 'website/paginated-homestays',
    activities = 'website/paginated-activities',
    events = 'website/paginated-events',
    related= 'website/related-entities',
    nearby='website/nearby-entities'
}

export enum getByIDEndpoints{
    villages = 'website/committee',
    products = 'website/product',
    homestays = 'website/homestay',
    activities = 'website/activity',
    events = 'website/event'
}

export enum placeholder{
    image='assets/images/general/no-image-found.jpg'
}

export enum search{
    itemPerPage =10
}