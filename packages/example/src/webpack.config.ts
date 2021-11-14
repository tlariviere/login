import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

const commonConfig = {
  entry: path.join(__dirname, "index.tsx"),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jp(e?)g|svg|gif)$/,
        type: "asset/resource",
      },
    ],
  },
  resolve: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],
  output: {
    path: path.resolve(__dirname, "../dist/public"),
    publicPath: "/",
    filename: "bundle.js",
  },
};

const config =
  process.env.NODE_ENV === "development"
    ? {
        ...commonConfig,
        mode: "development",
        devtool: "inline-source-map",
      }
    : {
        ...commonConfig,
        mode: "production",
        optimization: {
          concatenateModules: true,
          minimize: true,
        },
      };

export default config;
