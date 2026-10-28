/**
 * The ONLY image names that exist in this project (fixed asset contract).
 * Never reference a file name that is not re-exported from here.
 */
export const assets = {
  bgGame: require('../../assets/bg_game.png'),
  logo: require('../../assets/logo.png'),
  iconHome: require('../../assets/icon_home.png'),
  iconPause: require('../../assets/icon_pause.png'),
  sprite1: require('../../assets/sprite_1.png'),
  sprite2: require('../../assets/sprite_2.png'),
  sprite3: require('../../assets/sprite_3.png'),
  sprite4: require('../../assets/sprite_4.png'),
  sprite5: require('../../assets/sprite_5.png'),
};

export type SpriteKey = 'sprite1' | 'sprite2' | 'sprite3' | 'sprite4' | 'sprite5';
