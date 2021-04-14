import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class GetUsersList extends Simulation {

	val httpProtocol = http
		.baseUrl("https://radarin0webapp.herokuapp.com")
		.inferHtmlResources(BlackList(""".*\.js""", """.*\.css""", """.*\.gif""", """.*\.jpeg""", """.*\.jpg""", """.*\.ico""", """.*\.woff""", """.*\.woff2""", """.*\.(t|o)tf""", """.*\.png""", """.*detectportal\.firefox\.com.*"""), WhiteList())
		.acceptHeader("*/*")
		.acceptEncodingHeader("gzip, deflate")
		.acceptLanguageHeader("en-US,en;q=0.5")
		.userAgentHeader("Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0")

	val headers_0 = Map(
		"Accept" -> "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
		"If-Modified-Since" -> "Mon, 05 Apr 2021 08:29:41 GMT",
		"If-None-Match" -> """W/"c05-178a126d908"""",
		"Upgrade-Insecure-Requests" -> "1")

	val headers_1 = Map("Accept" -> "image/webp,*/*")

	val headers_2 = Map("Origin" -> "https://radarin0webapp.herokuapp.com")

    val uri2 = "https://radarin0restapi.herokuapp.com/api/users/list"

	val scn = scenario("GetUsersList")
		.exec(http("request_0")
			.get("/")
			.headers(headers_0)
			.resources(http("request_1")
			.get("/static/media/logo.6ce24c58.svg")
			.headers(headers_1),
            http("request_2")
			.get(uri2)
			.headers(headers_2)))

	setUp(scn.inject(atOnceUsers(20))).protocols(httpProtocol)