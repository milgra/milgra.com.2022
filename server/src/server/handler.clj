(ns server.handler
  (:require
   [clojure.java.io :as io]
   [clojure.pprint]
    [compojure.core :refer :all]
    [compojure.route :as route]
    [ring.middleware.cors :refer [wrap-cors]]
    [ring.middleware.json :refer [wrap-json-response]]
    [ring.middleware.defaults :refer [wrap-defaults site-defaults]]))


(defroutes app-routes

  (GET "/items/*" {params :route-params :as request}
       (let [path (str "resources/public/" (:* params))
             file (io/file path)
             prefix (.getAbsolutePath file)
             result (sort (map #(clojure.string/replace-first (.getCanonicalPath %) prefix (:* params)) (filter #(.isFile %) (file-seq file))))]
         result))
  (route/not-found "Not Found"))


(def app
  (-> app-routes
      (wrap-defaults site-defaults)
      (wrap-json-response)
      (wrap-cors
       :access-control-allow-origin [#".*"]
       :access-control-allow-methods [:get])))
