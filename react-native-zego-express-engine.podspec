require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-zego-express-engine"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-zego-express-engine
                   DESC
  s.homepage     = "https://github.com/github_account/react-native-zego-express-engine"
  # brief license entry:
  s.license      = "MIT"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "Your Name" => "yourname@email.com" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :path => '.' }

  s.source_files = "ios/**/*.{h,c,m,mm,swift}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency 'ZegoExpressEngine', '1.12.3'
  # ...
  # s.dependency "..."
end

