import { Config, Configs } from '../models/Config';
import Controller from './Controller';

export default class ConfigController extends Controller {
  static Model = Config
  static Collection = Configs
}
