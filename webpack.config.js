var path = require( 'path' );
var webpack = require( 'webpack' );
var CopyWebpackPlugin = require( 'copy-webpack-plugin' );

var plugins = [

	new webpack.ProvidePlugin( {

		jQuery: 'jquery',
		$: 'jquery'

	} ),

	new CopyWebpackPlugin( [

		{

			context: path.join( __dirname, 'src' ),
			from: '**/*'

		}

	], {

		ignore: [

			'*.js',
			'*.jsx',
			'*.es6',
			'*.css',
			'*.less'

		]

	} )

];

if( process.argv.indexOf( '--production' ) > -1 ) {

	process.env.NODE_ENV = 'production';

	plugins.push( new webpack.optimize.UglifyJsPlugin( {

		compress: { warnings: false },
		output: { comments: false }

	} ) );

}

module.exports = {

	entry: [

		'babel-polyfill',
		path.join( __dirname, 'src', 'main.jsx' )

	],
	output: {

		path: path.join( __dirname, 'target' ),
		filename: 'bundle.js',

	},

	devServer: {

		outputPath: path.join( __dirname, 'target' )

	},

	resolve: {

		extensions: [ '', '.js', '.jsx', '.es6' ],

		alias: {

			jquery: path.join( __dirname, 'node_modules', 'jquery', 'dist', 'jquery.min' )

		}

	},

	module: {

		loaders: [

			{

				test: /\.jsx$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
				query: {

					presets: [ 'es2015', 'react' ]

				}

			}, {

				test: /\.(js|es6)$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
				query: {

					presets: [ 'es2015' ]

				}

			}, {

				test: /\.css$/,
				loader: 'style-loader!css-loader'

			}, {

				test: /\.png$/,
				loader: 'url-loader?limit=100000'

			}, {

				test: /\.jpg$/,
				loader: 'file-loader'

			}, {

				test: /\.less$/,
				loader: 'style!css!less'

			}

		]

	},

	plugins: plugins

};
