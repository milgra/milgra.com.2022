(ns server.handler
  (:require
   [clojure.java.io :as io]
   [clojure.pprint]
   [compojure.core :refer :all]
   [compojure.route :as route]
   [ring.util.response :as resp]
   [ring.middleware.cors :refer [wrap-cors]]
   [ring.middleware.json :refer [wrap-json-response]]
   [ring.middleware.defaults :refer [wrap-defaults site-defaults]]))


(defroutes app-routes
  (GET "/" []
       (resp/redirect "index.html"))
  (GET "/items/*" {params :route-params :as request}
       (if (clojure.string/starts-with? (:* params) "search=")
         (let [text (nth (clojure.string/split (:* params) #"=") 1)
               command_name (str "find resources/public/blog resources/public/apps resources/public/work resources/public/tabs resources/public/comments" " -name '*" text "*'")
               command_text (str "find resources/public/blog resources/public/apps resources/public/work resources/public/tabs resources/public/comments" " -type f -exec grep -l " text " {} \\;")
               result_name (clojure.java.shell/sh "bash" "-c" command_name)
               result_text (clojure.java.shell/sh "bash" "-c" command_text)
               result_final (str (:out result_name) (:out result_text))
               files (if (= (count result_final) 0)
                       (seq ["No results"])
                       (sort (set (map #(subs % 17) (clojure.string/split result_final #"\n")))))]
           files)
         (let [path (str "resources/public/" (:* params))
               file (io/file path)
               prefix (.getAbsolutePath file)
               result (sort (map #(clojure.string/replace-first (.getCanonicalPath %) prefix (:* params)) (filter #(.isFile %) (file-seq file))))]
             result)))
  
  (route/not-found "No Comments"))


(def app
  (-> app-routes
      (wrap-defaults site-defaults)
      (wrap-json-response)
      (wrap-cors
       :access-control-allow-origin [#".*"]
       :access-control-allow-methods [:get])))
