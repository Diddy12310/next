module.exports = {
	transpileDependencies: ['vuetify'],
	devServer: {
		https: false,
		proxy: {
			'^/api': {
				target: 'https://www.theparadigm.ga',
				changeOrigin: true,
				ws: true,
				cookieDomainRewrite: {
					'*': ''
				}
			}
		}
	}
};
