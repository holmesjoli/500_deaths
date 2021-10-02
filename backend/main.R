library(magrittr)

sapply(list.files("R", full.names = T), source, .GlobalEnv)  
config <- yaml::read_yaml("config.yaml")

first_death <- as.Date("02-29-2020", "%m-%d-%Y")
today <- lubridate::today()
days_since_first_death <- today - first_death
seconds_since_first_death <- lubridate::time_length(days_since_first_death,
                                                    unit="seconds")
milliseconds_since_first_death <- lubridate::time_length(days_since_first_death,
                                                    unit="seconds")*1000
minutes_since_first_death <- lubridate::time_length(days_since_first_death,
                                                    unit="minutes")
hours_since_first_death <- lubridate::time_length(days_since_first_death, 
                                                  unit="hours")
days_since_first_death <- lubridate::time_length(today - first_death, 
                                                 unit = "days")

df <- one_in_x_est.age() 
# %>%
#   dplyr::bind_rows(one_in_x_est.ethnicity()) %>%
#   dplyr::bind_rows(one_in_x_est.age()) %>%
#   dplyr::bind_rows(one_in_x_est.state()) %>%
  dplyr::mutate(one_in_x = round(one_in_x),
                death_per_millisec = n/milliseconds_since_first_death,
                millisec_per_death = 1/death_per_millisec,
                death_per_sec = n/seconds_since_first_death,
                sec_per_death = 1/death_per_sec,
                death_per_min = n/minutes_since_first_death,
                min_per_death = 1/death_per_min,
                death_per_hour = n/hours_since_first_death,
                hour_per_death = 1/death_per_hour,
                death_per_day = n/days_since_first_death,
                day_per_death = 1/death_per_day) %>%
  dplyr::mutate(demo_indicator = ifelse(demo_indicator == "85 years and over", "85+", demo_indicator),
                demo_indicator = gsub(" years", "", demo_indicator))


age <- df %>%
  dplyr::filter(demographic == "age") %>% 
  dplyr::slice(1:10) %>%
  dplyr::mutate(log_one_in_x = log(one_in_x),
                x = seq(50, 500, 50)) %>%
  dplyr::select(-FIPS)

jsonlite::write_json(age, "./data/age_data.json")

deaths <-lapply(unique(age$demo_indicator), function(x) {
  
  n <- age %>% 
    dplyr::filter(demo_indicator == x)

  data.frame(demo_indicator = 1:n$n) %>%
    dplyr::mutate(demo_indicator = x,
                  color = n$color,
                  millisec_per_death = n$millisec_per_death,
                  log_one_in_x = n$log_one_in_x)
}) %>% dplyr::bind_rows()

jsonlite::write_json(deaths, "./data/age_deaths_not_summarized.json")
  
# nyt_obits <- xml2::read_html("https://www.nytimes.com/interactive/2020/obituaries/people-died-coronavirus-obituaries.html")
#   
# img_urls <- nyt_obits %>%  
#   rvest::html_nodes("img") %>%
#   rvest::html_attrs()
# 
# names <- nyt_obits %>% 
#   rvest::html_nodes("h1.g-name") %>% 
#   rvest::html_text()
# 
# summ <- nyt_obits %>%
#   rvest::html_nodes("div.g-summ") %>% 
#   rvest::html_text()
# 
# ages <- names %>% 
#   gsub(".*, ", "", .)
# 
# names <- names %>%
#   gsub(",.*", "", .)

# df <- data.frame(names = names,
#            summary = summ,
#            ages = ages
#            #,
#           # img_urls = img_urls
#           )
