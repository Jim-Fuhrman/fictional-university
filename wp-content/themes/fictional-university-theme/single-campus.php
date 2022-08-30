<?php
  get_header();
  while(have_posts()) {
    the_post(); 
    pageBanner();
    ?>
    <div class="container container--narrow page-section">
      <div class="metabox metabox--position-up metabox--with-home-link">
        <p><a class="metabox__blog-home-link" href="<?php echo get_post_type_archive_link('campus'); ?>"><i class="fa fa-home" 
            aria-hidden="true"></i> All Campuses</a> <span class="metabox__main"><?php the_title(); ?></span>
        </p>
      </div>
    <div class="generic-content"><?php the_content(); ?></div>
    
    <?php
        $mapLocation = get_field('map_location');
    ?>

    <div class="acf-map">
      <div class="marker" data-lat="<?php echo $mapLocation['lat']; ?>" data-lng="<?php echo $mapLocation['lng']; ?> ">
          <h3><?php the_title(); ?></h3>
          <?php echo $mapLocation['address']; ?>
      </div>
    </div>

    <?php
      $relatedPrograms = new WP_Query(array(
        'posts_per_page' => -1,
        'post_type' => 'program',
        'orderby' => 'title',
        'order' => 'ASC',
        'meta_query' => array(
          /* think of each inner array as a filter. */
          array(
            /* Wordpress serializes related_programs. Thus, if get_the_ID() yields 12, our compare property will return 12 if the returned value is 120, 1200, etc. Thus, we need double-quotes around get_the_ID() next to 'value' => */
            'key' => 'related_campus',
            'compare' => 'like',
            'value' => '"' . get_the_ID() . '"'
          )
        )
      ));

      if ($relatedPrograms->have_posts()) {
        echo '<hr class="section-break">';
        echo '<h2 class="headline headline--medium">Programs Available at this Campus</h2>';

        echo '<ul class="min-list link-list">';
        while($relatedPrograms->have_posts()) {
          $relatedPrograms->the_post(); ?>
            <li>
              <a href="<?php the_permalink(); ?>">
                <?php the_title(); ?></a>
            </li>
        <?php }
        echo '</ul>';
      }

        wp_reset_postdata();  /* Without this line you won't see Upcoming Events. */

        $today = date('Ymd');
        $relatedEvents = new WP_Query(array(
          'posts_per_page' => -1,
          'post_type' => 'event',
          'meta_key' => 'event_date',
          'orderby' => 'meta_value_num',
          'order' => 'ASC',
          'meta_query' => array(
            /* think of each inner array as a filter. */
            array(
              'key' => 'event_date',
              'compare' => '>=',
              'value' => $today,
              'type' => 'numeric'
            ),
            array(
              /* Wordpress serializes related_programs. Thus, if get_the_ID() yields 12, our compare property will return 12 if the returned value is 120, 1200, etc. Thus, we need double-quotes around get_the_ID() next to 'value' => */
              'key' => 'related_campus',
              'compare' => 'like',
              'value' => '"' . get_the_ID() . '"'
            ),
          )
        ));
  
        if ($relatedEvents->have_posts()) {
          echo '<hr class="section-break">';
          echo '<h2 class="headline headline--medium">Upcoming Events at this Campus</h2>';
  
          while($relatedEvents->have_posts()) {
            $relatedEvents->the_post(); 
              get_template_part('template-parts/content-event');
          }
          echo '</ul>';
        }
  
          wp_reset_postdata();  /* Without this line you won't see Upcoming Events. */
          ?>

<?php }
    get_footer();
?>