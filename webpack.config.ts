import CopyPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { resolve } from 'path';

const config = {
    mode: 'production',
    entry: {
        setup: './src/setup.ts',
        english: './src/languages/english.ts',
        'chinese-simplified': './src/languages/chinese-simplified.ts',
        'chinese-traditional': './src/languages/chinese-traditional.ts',
        french: './src/languages/french.ts',
        german: './src/languages/german.ts',
        italian: './src/languages/italian.ts',
        japanese: './src/languages/japanese.ts',
        korean: './src/languages/korean.ts',
        'portuguese-brasil': './src/languages/portuguese-brasil.ts',
        portuguese: './src/languages/portuguese.ts',
        russian: './src/languages/russian.ts',
        spanish: './src/languages/spanish.ts',
        turkish: './src/languages/turkish.ts'
    },
    output: {
        filename: '[name].mjs',
        path: resolve(__dirname, 'packed'),
        library: {
            type: 'module'
        },
        clean: true
    },
    performance: {
        hints: false
    },
    experiments: {
        outputModule: true
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: { mangle: false, compress: false, keep_classnames: true, keep_fnames: true }
            })
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: '**/*.html', to: '[path][name][ext]', context: 'src', noErrorOnMissing: true },
                { from: 'manifest.json', to: 'manifest.json', noErrorOnMissing: true },
                { from: 'data/data*.json', to: '[path][name][ext]', context: 'src', noErrorOnMissing: true },
                { from: 'assets', to: 'assets', context: 'src', noErrorOnMissing: true }
            ]
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: [resolve('./node_modules'), resolve('.')]
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    }
};

export default config;
