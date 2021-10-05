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

df <- one_in_x_est.age() %>%
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
  dplyr::mutate(demo_indicator = gsub(" years", "", demo_indicator))


age <- df %>%
  dplyr::filter(demographic == "age" & demo_indicator != "Total") %>% 
  dplyr::select(demo_indicator, millisec_per_death, n) %>%
  dplyr::mutate(x = seq(1, 6, 1))


jsonlite::write_json(age, "../data/age_data2.json")

deaths <-lapply(unique(age$demo_indicator), function(x) {

  n <- age[age$demo_indicator == x, ]

  data.frame(demo_indicator = 1:n$n) %>%
    dplyr::mutate(demo_indicator = x,
                  millisec_per_death = n$millisec_per_death,
                  x = n$x)
}) %>% 
  dplyr::bind_rows() 

deaths2 <- deaths %>%
  dplyr::group_by(demo_indicator) %>%
  dplyr::mutate(id = seq(1, dplyr::n(), 1)) %>%
  dplyr::ungroup() %>%
  dplyr::mutate(id2 = id,
                id = id - 1) %>% 
  dplyr::group_by(demo_indicator, id, id2) %>%
  dplyr::mutate(delay = millisec_per_death*id,
                delay2 = millisec_per_death*id2) %>% 
  dplyr::filter(delay <= 3600000) %>%
  dplyr::select(-id2)

# jsonlite::write_json(deaths2, "../data/age_deaths_not_summarized.json")
  
nyt_obits <- xml2::read_html("https://www.nytimes.com/interactive/2020/obituaries/people-died-coronavirus-obituaries.html")

img_urls <- nyt_obits %>%
  rvest::html_nodes("img") %>%
  rvest::html_attrs()

names <- nyt_obits %>%
  rvest::html_nodes("h1.g-name") %>%
  rvest::html_text()

summ <- nyt_obits %>%
  rvest::html_nodes("div.g-summ") %>%
  rvest::html_text()

ages <- names %>%
  gsub(".*, ", "", .)

names <- names %>%
  gsub(",.*", "", .)

df <- data.frame(name = names,
           summary = summ,
           age2 = ages,
           age = as.numeric(ages)) %>%
  dplyr::mutate(demo_indicator = dplyr::case_when(age >= 75 ~ "75+",
                                                  age < 75 & age >= 65 ~ "65-74",
                                                  age < 65 & age >= 50 ~ "50-64",
                                                  age < 50 & age >= 30 ~ "30-49",
                                                  age < 30 & age >= 18 ~ "18-29",
                                                  age < 18 ~ "0-17"),
                summary = gsub("\n", "", summary),
                summary = stringr::str_trim(summary, "both"),
                person_id = seq(1, dplyr::n(), 1),
                person_id = person_id - 1,
                name_age = paste(name, age, sep = ", ")) %>%
  dplyr::filter(!is.na(age))

freq <- deaths2 %>%
  dplyr::group_by(demo_indicator) %>%
  dplyr::tally()

ids <- sapply(unique(df$demo_indicator), function(x) {
  df %>%
    dplyr::filter(demo_indicator == x) %>%
    dplyr::pull(person_id)
}, USE.NAMES = TRUE, simplify = F)

pull <- lapply(names(ids), function(x) {
  n <- freq %>%
    dplyr::filter(demo_indicator == x) %>%
    dplyr::pull(n)
  
  choices <- ids[[x]]
  
  selection <- sample(choices, n, replace = F)

  data.frame(person_id = selection,
             demo_indicator = rep(x, n),
             stringsAsFactors = F) %>%
    dplyr::mutate(id = seq(1, n, 1),
                  id = id - 1)
}) %>% dplyr::bind_rows()

deaths3 <- deaths2 %>%
  dplyr::left_join(pull) %>%
  dplyr::left_join(df)

jsonlite::write_json(deaths3, "../data/age_deaths_not_summarized.json")

