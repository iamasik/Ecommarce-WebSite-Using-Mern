import { Helmet } from "react-helmet"
function Halmet({title}) {
    return (
    <Helmet>
        <meta charSet="utf-8" />
        <title>{title} | Ecom</title>
        <link rel="canonical" href="http://mysite.com/example" />
    </Helmet>
    )
}

export default Halmet
