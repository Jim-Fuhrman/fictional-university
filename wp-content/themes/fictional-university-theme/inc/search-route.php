<?php

add_action('rest_api_init', 'universityRegisterSearch');

function universityRegisterSearch() {
  register_rest_route('university/v1', 'search', array(
    'methods' => WP_REST_SERVER::READABLE, 
    'callback' => 'universitySearchResults'
  ));
}

function universitySearchResults($data) {
  $mainQuery = new WP_Query(array(
    'post_type' => array('post', 'page', 'professor', 'program', 'campus', 'event'),
    's' => sanitize_text_field($data['term'])
  ));
  
  $mainQueryResults = array(
    'generalInfo' => array(),
    'professors' => array(),
    'programs' => array(), 
    'events' => array(),
    'campuses' => array()
  );

  while($mainQuery->have_posts()) {
    $mainQuery->the_post();

    if (get_post_type() == 'post' or get_post_type() == 'page') {
      array_push($mainQueryResults['generalInfo'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'postType' => get_post_type(),
        'authorName' => get_the_author()
      ));
    }
    if (get_post_type() == 'professor') {
      array_push($mainQueryResults['professors'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'image' => get_the_post_thumbnail_url(0, 'professorLandscape')
      ));
    }
    if (get_post_type() == 'program') {
      array_push($mainQueryResults['programs'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'id' => get_the_id()
      ));
    }
    if (get_post_type() == 'event') {
      $eventDate = new DateTime(get_field('event_date'));
      $description = null;
      if (has_excerpt()) {
        $description = get_the_excerpt();
      } else {
        $description = wp_trim_words(get_the_content(), 18);
      }

      array_push($mainQueryResults['events'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'month' => $eventDate->format('M'),
        'day' => $eventDate->format('d'),
        'description' => $description
      ));
    }
    if (get_post_type() == 'campus') {
      array_push($mainQueryResults['campuses'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink()
      ));
    }
  }

  if ($mainQueryResults['programs']) {
    $programsMetaQuery = array('relation' => 'or');

  foreach($mainQueryResults['programs'] as $item) {
    array_push($programsMetaQuery, array(
      'key' => 'related_programs',
      'compare' => 'LIKE', 
      'value' => '"' . $item['id'] . '"'
    ));
  }

  $programRelationshipQuery = new WP_Query(array(
    'post_type' => 'professor',
    'meta_query' => $programsMetaQuery
  ));

  while($programRelationshipQuery->have_posts()) {
    $programRelationshipQuery->the_post();
      if (get_post_type() == 'professor') {
        array_push($mainQueryResults['professors'], array(
          'title' => get_the_title(),
          'permalink' => get_the_permalink(),
          'image' => get_the_post_thumbnail_url(0, 'professorLandscape')
        ));
    }
  }

  /* array_unique removes duplicates that could cause problems. If the word biology is in a professor's post, 
  that professor may show up twice in a query. Lesson 78: Search Logic That's Aware of Relationships. The 
  array_values prevents an unwanted index value showing in postman. */

  $mainQueryResults['professors'] = array_values(array_unique($mainQueryResults['professors'], SORT_REGULAR));
  }
  return $mainQueryResults;
}