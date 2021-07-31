module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                img: "@/assets/img",
                css: "@/assets/css",
                network: "@/network",
                components: "@/components",
                views: "@/views",
            },
        },
    },
};
