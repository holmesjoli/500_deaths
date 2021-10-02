#' @title Get CDC data
get_cdc_data <- function(url,
                         LIMIT = 5000) {
  
  CDC_APP_TOKEN <- Sys.getenv("CDC_APP_TOKEN")
  
  df <- httr::GET(glue::glue(url, "?$$app_token={CDC_APP_TOKEN}&$limit={LIMIT}")) %>%
    httr::content() %>%
    dplyr::bind_rows()
}

one_in_x_est.helper <- function(deaths_est, pop_est) {
  
  deaths_est %>%
    dplyr::mutate(n = as.numeric(n)) %>%
    dplyr::inner_join(pop_est) %>%
    janitor::adorn_totals() %>%
    dplyr::mutate(one_in_x = pop_est/n)
}

#' @title Deaths by ethnicity estimate
#' @description From CDC https://data.cdc.gov/NCHS/Provisional-COVID-19-Deaths-Distribution-of-Deaths/pj7m-y5uh
deaths_est.ethnicity <- function(url = "https://data.cdc.gov/resource/pj7m-y5uh.json") {

  get_cdc_data(url = url) %>%
    dplyr::filter(group == "By Total" & state == "United States" & 
                    indicator == "Count of COVID-19 deaths") %>%
    dplyr::select(-c(group, state, indicator, month, footnote)) %>%
    tidyr::pivot_longer(names_to = "ethnicity", values_to = "n", 
                        cols = -c("data_as_of", "start_week", "end_week",
                                  "year")) %>% 
    dplyr::mutate(n = as.numeric(n),
                  demo_indicator = ifelse(ethnicity == "hispanic_latino_total", ethnicity, "non_hispanic_latino_total")) %>%
    dplyr::group_by(demo_indicator) %>%
    dplyr::summarise(n = sum(n))
}

#' @title Population by ethnicity estimate
pop_est.ethnicity <- function(table = "B03002",
                              vars = c("002", "012")) {

  get_df(table = table, vars = vars) %>%
    dplyr::mutate(ethnicity = dplyr::case_when(grepl("_002", variable) ~ "non_hispanic_latino_total",
                                               grepl("_012", variable) ~ "hispanic_latino_total")) %>%
    dplyr::group_by(ethnicity) %>%
    dplyr::summarise(pop_est = sum(estimate)) %>% 
    dplyr::select(demo_indicator = ethnicity, pop_est)
}

one_in_x_est.ethnicity <- function() {
  
  one_in_x_est.helper(deaths_est = deaths_est.ethnicity(), 
                      pop_est = pop_est.ethnicity()) %>%
    dplyr::mutate(demographic = "ethnicity")
}

death_est.helper_age_sex <- function(url = "https://data.cdc.gov/resource/vsak-wrfu.json") {
  get_cdc_data(url = url)
}

deaths_est.sex <- function() {

  df <- death_est.helper_age_sex() %>%
    dplyr::filter(group == "By Total" & state == "United States" & 
                    sex != "All Sexes" & age_group == "All Ages") %>% 
    dplyr::select(demo_indicator = sex, n = covid_19_deaths)
}

pop_est.sex <- function(table = "B01001",
                        vars = c("002", "026")) {

  get_df(table = table, vars = vars) %>%
    dplyr::filter(variable %in% paste(table, vars, sep = "_")) %>%
    dplyr::mutate(demo_indicator = dplyr::case_when(grepl("_002", variable) ~ "Male",
                                         grepl("_026", variable) ~ "Female")) %>%
    dplyr::select(demo_indicator, pop_est = estimate)
}

one_in_x_est.sex <- function() {

  one_in_x_est.helper(deaths_est = deaths_est.sex(), 
                      pop_est = pop_est.sex()) %>%
    dplyr::mutate(demographic = "sex")
}

deaths_est.age <- function() {
  
  df <- death_est.helper_age_sex() %>%
    dplyr::filter(group == "By Total" & state == "United States" & 
                  sex == "All Sexes" & age_group != "All Ages") %>% 
    dplyr::select(demo_indicator = age_group, n = covid_19_deaths)
}

deaths_est.state <- function() {
  
  df <- death_est.helper_age_sex() %>%
    dplyr::filter(group == "By Total" & state != "United States" & 
                    sex == "All Sexes" & age_group == "All Ages") %>% 
    dplyr::select(demo_indicator = age_group, n = covid_19_deaths)
}

acs_male <- function(df, vars, sex = "male") {

  df %>%
    dplyr::filter(variable %in% paste(table, vars, sep = "_")) %>%
    dplyr::mutate(sex = sex,
                  demo_indicator = dplyr::case_when(grepl("_003", variable) ~ "1-4 years",
                                                    grepl("_004", variable) ~ "5-14 years",
                                                    grepl("_005", variable) ~ "5-14 years",
                                                    grepl("_006", variable) ~ "15-24 years",
                                                    grepl("_007", variable) ~ "15-24 years",
                                                    grepl("_008", variable) ~ "15-24 years",
                                                    grepl("_009", variable) ~ "15-24 years",
                                                    grepl("_010", variable) ~ "15-24 years",
                                                    grepl("_011", variable) ~ "25-34 years",
                                                    grepl("_012", variable) ~ "25-34 years",
                                                    grepl("_013", variable) ~ "35-44 years",
                                                    grepl("_014", variable) ~ "35-44 years",
                                                    grepl("_015", variable) ~ "45-54 years",
                                                    grepl("_016", variable) ~ "45-54 years",
                                                    grepl("_017", variable) ~ "55-64 years",
                                                    grepl("_018", variable) ~ "55-64 years",
                                                    grepl("_019", variable) ~ "55-64 years",
                                                    grepl("_020", variable) ~ "65-74 years",
                                                    grepl("_021", variable) ~ "65-74 years",
                                                    grepl("_022", variable) ~ "65-74 years",
                                                    grepl("_023", variable) ~ "75-84 years",
                                                    grepl("_024", variable) ~ "75-84 years",
                                                    grepl("_025", variable) ~ "85 years and over"))
}

acs_female <- function(df, vars, sex = 'female') {
  
  df %>%
    dplyr::filter(variable %in% paste(table, vars, sep = "_")) %>%
    dplyr::mutate(sex = sex,
                  demo_indicator = dplyr::case_when(grepl("_027", variable) ~ "1-4 years",
                                                    grepl("_028", variable) ~ "5-14 years",
                                                    grepl("_029", variable) ~ "5-14 years",
                                                    grepl("_030", variable) ~ "15-24 years",
                                                    grepl("_031", variable) ~ "15-24 years",
                                                    grepl("_032", variable) ~ "15-24 years",
                                                    grepl("_033", variable) ~ "15-24 years",
                                                    grepl("_034", variable) ~ "15-24 years",
                                                    grepl("_035", variable) ~ "25-34 years",
                                                    grepl("_036", variable) ~ "25-34 years",
                                                    grepl("_037", variable) ~ "35-44 years",
                                                    grepl("_038", variable) ~ "35-44 years",
                                                    grepl("_039", variable) ~ "45-54 years",
                                                    grepl("_040", variable) ~ "45-54 years",
                                                    grepl("_041", variable) ~ "55-64 years",
                                                    grepl("_042", variable) ~ "55-64 years",
                                                    grepl("_043", variable) ~ "55-64 years",
                                                    grepl("_044", variable) ~ "65-74 years",
                                                    grepl("_045", variable) ~ "65-74 years",
                                                    grepl("_046", variable) ~ "65-74 years",
                                                    grepl("_047", variable) ~ "75-84 years",
                                                    grepl("_048", variable) ~ "75-84 years",
                                                    grepl("_049", variable) ~ "85 years and over"))
}

pop_est.age <- function(table = "B01001",
                        male = 3:25,
                        female = 27:49) {
  
 male <- stringr::str_pad(male, width = 3, side = "left", pad = "0")
 female <- stringr::str_pad(female, width = 3, side = "left", pad = "0")

 vars <- c(male, female)
 
 df <- get_df(table = table, vars = vars)
 
 df <- acs_male(df = df, vars = male) %>%
   dplyr::bind_rows(acs_female(df = df, vars = female)) %>%
     dplyr::group_by(demo_indicator) %>%
     dplyr::summarise(pop_est = sum(estimate)) %>%
     dplyr::ungroup()
}

one_in_x_est.age <- function() {

  one_in_x_est.helper(deaths_est = deaths_est.age(),
                      pop_est = pop_est.age()) %>%
    dplyr::mutate(demographic = "age")
}
