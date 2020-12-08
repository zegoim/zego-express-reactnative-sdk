require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-zego-express-engine"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-zego-express-engine
                   DESC
  s.homepage     = "https://github.com/zegoim/zego-express-reactnative-sdk"
  # brief license entry:
  s.license      = "MIT"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "zego.im" => "dev@zego.im" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :path => '.' }

  s.source_files = "ios/**/*.{h,c,m,mm,swift}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency 'ZegoExpressEngine', '1.19.0'
  # ...
  # s.dependency "..."
end

