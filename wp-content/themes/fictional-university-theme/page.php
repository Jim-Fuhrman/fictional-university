<?php 

  get_header();

  while(have_posts()) {
    the_post();
    pageBanner();
    ?>
    
    
    <div class="container container--narrow page-section">

      <?php
        $theParentId = wp_get_post_parent_id(get_the_ID());
        if ($theParentId) { ?>
          <div class="metabox metabox--position-up metabox--with-home-link">
            <p><a class="metabox__blog-home-link" href="<?php echo get_permalink($theParentId); ?>"><i class="fa fa-home" 
                aria-hidden="true"></i> Back to <?php echo get_the_title($theParentId); ?></a> <span class="metabox__main"><?php the_title(); ?></span>
            </p>
          </div>
          
        <?php }
      ?>

      <?php 
      /* $testArray helps identify pages that are neither a parent nor a child page
      When that's the case, we don't want to display any page links. $testArray will b
      be null if the page has no child pages. */
      $testArray = get_pages(array(
        'child_of' => get_the_ID()
      ));
       
      if ($theParentId or $testArray) { ?>
        <div class="page-links">
          <h2 class="page-links__title"><a href="<?php echo get_permalink($theParentId); ?>"><?php echo get_the_title($theParentId); ?></a></h2>
          <ul class="min-list">
            <?php

              if ($theParentId) {
                $findChildrenOf = $theParentId;
              } else {
                $findChildrenOf = get_the_ID();
              }

              wp_list_pages(array(
                'title_li' => NULL,
                'child_of' => $findChildrenOf,
                'sort_column' => 'menu_order'
              ));
            ?>
          </ul>
        </div> 
      <?php } ?>

      <div class="generic-content">
       <?php the_content(); ?>
      </div>
    </div>

  <?php }

get_footer();

?>