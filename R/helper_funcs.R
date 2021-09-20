#' @title Set API Key
#' @param key. String. The API key credential. 
api_key <- function(key) UseMethod("api_key")

#' @title Set Census API Key
#' @inheritParams api_key
api_key.census <- function(key) {
  Sys.setenv(CENSUS_API_KEY = key)
}

#' @title Get key
#' @description Checks to make sure API exists
get_key <- function(env_var) UseMethod("check_key")

get_key.default <- function(env_var,
                            title,
                            url,
                            install,
                            msg = "Please sign up for a {title} API key at: '{url}'. 
                            Then install the key using {install}, where 'X' is the key you received from {title}.") {
  
  if (Sys.getenv(env_var) != "") {
    Sys.getenv(env_var)
  } else {
    assertthat::assert_that(FALSE,
                            msg = glue::glue(msg, 
                                             title = title, 
                                             url = url, 
                                             install = install))
  }
}

#' @title Checks to make sure the census API key is set as an environment variable
#' @examples 
#' \dontrun{
#' texascc::api_key.census(key = "X")
#' texascc::get_key.census()
#' }
#' @return TRUE if a census api key exists, error if it does not exist
get_key.census <- function(env_var = "CENSUS_API_KEY",
                           title = "Census",
                           url = "https://api.census.gov/data/key_signup.html",
                           install = "texascc::api_key.census(key = 'X')") {
  
  get_key.default(env_var = env_var,
                  title = title, 
                  url = url, 
                  install = install)
}

#' @title Test attributes
#' @description Test's that the attributes of the parameters passed in are 
#' correct
#' @title attr. List of attributes to test
test_attr <- function(attr) {
  assertthat::assert_that(c("geography") %in% names(attr),
                          msg = "Table configuration is missing geography parameter")
  assertthat::assert_that(any(c("variables", "table") %in% names(attr)),
                          msg = "Table configuration is missing variables or table parameter")
  if(all(c("variables", "table") %in% names(attr))) {
    assertthat::assert_that(all(attr$table == sub("_.*", "", attr$variables)),
                            msg = "Table name differs from variable root")  
  }
  return(TRUE)
}

#' @title Add default parameters for ACS tables
#' @inheritParams child_care_db
acs_tables <- function(acs_year = 2019,
                       acs_geography = "us",
                       acs_county = NULL,
                       table) {
  
  list(year = acs_year,
       geography = acs_geography,
       county = acs_county,
       table = table)
}

#' @title Download ACS
#' @description Passes in a list of parameters to download the ACS census
#' data using functions from the tidycensus package
#' @param tbls list. List of census tables with attributes to download
#' @param raw_pth. Path to save the raw data.
#' @details To find a list of parameters to pass see documentation for 
#' tidycensus::get_acs
#' @examples 
#' \dontrun{
#' tbls <- list(B23008 = list(year = 2019, state = 48, 
#'                                geography = "tract", county = 439))
#' raw_pth <- "C:/"
#' dwnld.acs(tbls = tbls, raw_pth = raw_pth)
#' }
dwnld.acs <- function(tbls, raw_pth, ...) {
  
  get_key.census()
  
  f <- function(name, tbls, pth) {
    
    attr <- tbls[[name]]
    attr$table <- name
    
    test_attr(attr)
    
    df <- do.call(tidycensus::get_acs, attr)
    
    attr$df <- df
  }
  
  sapply(names(tbls),
         f,
         tbls = tbls,
         pth = raw_pth,
         USE.NAMES = TRUE,
         simplify = FALSE)
}